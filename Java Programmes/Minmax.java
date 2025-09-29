import java.util.Scanner;
import java.util.Vector;
import java.util.Collections;

public class Minmax {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int total;
            int num;
            int max;
            int min;

            total = scanner.nextInt();
            Vector<Integer>mylist = new Vector<Integer>();

            for (int i=0; i<total; i++) {
                num = scanner.nextInt();
                mylist.add(num);
            }

            Collections.sort(mylist);

            min = mylist.elementAt(0);
            max = mylist.elementAt(total-1);

            System.out.print("Minimum : ");
            System.out.println(min);
            System.out.print("Maximum : ");
            System.out.println(max);
        }
    }
}
