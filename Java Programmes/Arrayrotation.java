import java.util.Arrays;
import java.util.Scanner;

public class Arrayrotation {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int N;
            int num;
            int dummy;
            //int dummy2;

            N =scanner.nextInt();

            int[] mylist = new int[N];

            for (int i=0; i<N; i++) {
                num = scanner.nextInt();
                mylist[i] = num;
            }

            for (int j=0; j<N; j++) {
                dummy = mylist[j];
                mylist[j] = mylist[N-1];
                mylist[N-1] = dummy;
            }

            System.out.println(Arrays.toString(mylist));
        }
    }
}
