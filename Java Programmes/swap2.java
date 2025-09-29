import java.util.Arrays;
import java.util.Scanner;

public class swap2 {
    public static void main(String arg[]) {
        try(Scanner scanner = new Scanner(System.in)) {
            int N;
            int K;
            int num;
            int end;

            N = scanner.nextInt();
            K = scanner.nextInt();

            int [] mylist = new int[N];

            for (int i=0; i<N; i++) {
                num = scanner.nextInt();
                mylist[i] = num;
            }

            end = N-1;   //size of an array

            int dup_k = K;

            while (dup_k > 1) {
                end -= 1;
                dup_k -= 1;
            }

            int temp;

            temp = mylist[K-1];
            mylist[K-1] = mylist[end];
            mylist[end] = temp;

            System.out.println(Arrays.toString(mylist));
        }
    }
}
